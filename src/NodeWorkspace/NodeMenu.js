import React, { useState, useEffect, useCallback } from 'react';
import './node-menu.css';

const NodeMenuList = React.memo((props) => {
    
    const [optionsList, setOptionsList] = useState([]);
    const [hoverDelayHandler, setHoverDelayHandler] = useState(null);
    const [showSubmenu, setShowSubmenu] = useState(Array(props.menuItems.length).fill(false));
    
    const onMouseEnter = useCallback((event) => {
        const menuItemIndex = event.target.getAttribute('data-index');
        setHoverDelayHandler(setTimeout(() => {
            const ssm = Array(props.menuItems.length).fill(false);
            ssm[menuItemIndex] = true;
            setShowSubmenu(ssm);
        }, 500));
    }, [showSubmenu]);
    
    const onMouseLeave = () => {
        clearTimeout(hoverDelayHandler);
    };
    
    const getMenuItems = (menuItem, index) => {
        if (menuItem.submenu != null) {
            return (
                <li className='NodeMenuItem expandable'
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    key={index}
                    data-index={index}
                >
                    {menuItem.title}
                    {
                        showSubmenu[index] ?
                        (<NodeMenuList menuItems={menuItem.submenu} />) :
                        (<></>)
                    }
                </li>
            );
        } else {
            return (
                <li className='NodeMenuItem'
                    key={index}
                    data-index={index}
                    onClick={menuItem.action}
                >
                    {menuItem.title}
                </li>
            );
        }
    };
    
    //useEffect(setShowSubmenu(Array(props.menuItems.length).fill(false)), []);
    //useEffect(() => {console.log('showSubmenu', showSubmenu)}, [showSubmenu]);
    
    useEffect(() => {
        const options = getMenuList();
        setOptionsList(options);
    }, [showSubmenu]);
    
    const getMenuList = useCallback(() => {
        const options = [];
        props.menuItems.map((item, index) => {
            options.push(getMenuItems(item, index));
        });
        return options;
    }, [props.menuList, showSubmenu]);
    
    return (
        <ul className='NodeMenuList'>
            {optionsList}
        </ul>
    );
});

const NodeMenu = (props) => {
//     console.log(props);
    
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
