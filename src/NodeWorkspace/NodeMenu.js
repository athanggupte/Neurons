import React, { useState } from 'react';
import './node-menu.css';

const NodeMenuList = (props) => {
    
    const [hoverDelayHandler, setHoverDelayHandler] = useState(null);
    
    const onMouseEnter = (event) => {
        console.log('MouseEnter event.target', event.target);
        console.log('MouseEnter this', this.props);
        setHoverDelayHandler(setTimeout(() => {
            //console.log('Expand submenu of', event.target);
        }, 500));
    };
    
    const onMouseLeave = () => {
        clearTimeout(hoverDelayHandler);
    };
    
    const getMenuItems = (menuItem, index) => {
        console.log(menuItem);
//         if (menuItem.submenu != null) {
//             return (
//                 <li className='NodeMenuItem'>
//                     {menuItem.title}
//                     <NodeMenuList menuItems={menuItem.submenu}/>
//                 </li>
//             );
//         }
        if (menuItem.submenu != null) {
            return (
                <li className='NodeMenuItem'
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    menuItemIndex={index}
                >
                    {menuItem.title}
                </li>
            );
        } else {
            return (
                <li className='NodeMenuItem'
                    menuItemIndex={index}
                >
                    {menuItem.title}
                </li>
            );
        }
    };
    
    const getMenuList = () => {
        const options = [];
        props.menuItems.map((item, index) => {
            options.push(getMenuItems(item, index));
        });
        return options;
    };
    
    return (
        <ul className='NodeMenuList'>
            {getMenuList()}
        </ul>
    );
};

const NodeMenu = (props) => {
    console.log(props);
    
    return (
        <div className='NodeMenu'
            style={{
                top: props.ypos,
                left: props.xpos,
            }}
        >
            <NodeMenuList menuItems={props.menuItems.menu} />
        </div>
    );
};

export default NodeMenu;
