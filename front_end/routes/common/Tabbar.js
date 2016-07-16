import React from 'react'

import CSSModules from 'react-css-modules'
import styles from './Tabbar.css'

class Tabbar extends React.Component {
    render() {
        var { currentTab, setCurrentTab, tabs } = this.props;
        return (
            <div styleName='tabs'>
                { tabs.map((tab, i)=>(
                    <div styleName='tab' onClick={()=>setCurrentTab(i)}>
                        { tab }
                        { currentTab == i && <div styleName='tab-current' /> }
                    </div>
                ))}
            </div>
        );
    }
}

module.exports = CSSModules(Tabbar, styles);
