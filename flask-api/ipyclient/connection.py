from jupyter_client import KernelManager
from queue import Empty

from pprint import PrettyPrinter
pprint = PrettyPrinter(indent=4).pprint

class IPythonConnection(object):
    """
    Simple wrapper over JupyterClient and KernelManager
    """
    
    def __init__(self):
        """
        Construct an IPythonConnection object without connecting
        """
        self.kmgr = KernelManager(kernel_name = 'python3')
        self.client = None
        self._status_ = 'disconnected'
        self._kernel_ = {}
        
    def connect(self):
        """
        Start the kernel and connect a client to the ports
        """
        self.kmgr.start_kernel()
        self.client = self.kmgr.client()
        self.kernel_info()
        
    def kernel_info(self, force_recheck = False):
        """
        Retrieve kernel info
        
        Parameters:
            force_recheck: (bool) Forces fetching kernel info from kernel
        """
        if force_recheck or not self._kernel_:
            # get kernel info
            self.client.kernel_info()
            msg = self.client.get_shell_msg(timeout=2)
            while msg['msg_type'] != 'kernel_info_reply':
                msg = self.client.get_shell_msg(timeout=2)
                
            content = msg['content']
            self._kernel_['protocol_version'] = content['protocol_version']
            self._kernel_['implementation_version'] = content['implementation_version']
            self._kernel_['python_version'] = content['language_info']['version']
            self._kernel_['banner'] = content['banner']
        
        return self._kernel_
        
    def _execute_(self, expr):
        """
        Submits execution request to the kernel
        """
        return self.client.execute(expr)
        
    def execute_for_result(self, expr):
        """
        Executes the input statement and returns the result
        """
        msg_id = self._execute_(expr)
        res = self.io_loop()
        sh = self.shell_loop()
        assert(sh['parent_id'] == msg_id, 'Wrong result')
        return {'shell': sh, 'res': res}
        
        
    def io_loop(self, debug = False):
        """
        Executes one IO loop i.e. 'busy' -> 'result' -> 'idle'
        
        Returns:
            data: (dict) Result/output stream of the execution
        """
        
        if not self.kmgr.is_alive():
            print("Connection closed")
            return None
        
        result = {}
        self._status_ = 'busy'
        
        while self._status_ != 'idle' and self.kmgr.is_alive():
            try:
                msg = self.client.get_iopub_msg(timeout=2)
                content = msg['content']
                
                if debug:
                    print("\n<{}>".format(msg['msg_type'])) # Debugging
                    pprint(content)
                    
                if msg['msg_type'] == 'status':
                    self._status_ = content['execution_state']
                else:
                    result[msg['msg_type']] = content
                    
            except Empty:
                break
        
        print(result)
        return result
    
    def shell_loop(self):
        try:
            msg = self.client.get_shell_msg(timeout = 2)
            msg['parent_id'] = msg['parent_header']['msg_id']
            msg.pop('header')
            msg.pop('buffers')
            msg.pop('parent_header')
        except Empty:
            return None
        return msg
