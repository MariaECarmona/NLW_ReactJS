import React from "react";
import Sidebar from "react-sidebar";

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: true
        };
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }

    onSetSidebarOpen(open) {
        this.setState({ sidebarOpen: open });
    }

    render() {
        return (
            <>
                <Sidebar
                    sidebar={
                        <button
                            className={styles.reactIcons}
                            disabled={!episode || episodeList.length === 1}
                        >
                            <IoCloseOutline size="1.5rem" className={styles.playlistIcon} title="Lista de reprodução" />
                        </button>

                    }
                    open={this.state.sidebarOpen}
                    onSetOpen={this.onSetSidebarOpen}
                    styles={{ sidebar: { background: "var(--purple- 500)" } }}

                >

                </Sidebar>
                <button
                    className={styles.reactIcons}
                    disabled={!episode || episodeList.length === 1}
                    onClick={() => this.onSetSidebarOpen(true)}
                >
                    <RiPlayList2Fill size="1.5rem" className={styles.playlistIcon} title="Lista de reprodução" />
                </button>
            </>
        );
    }
}

export default Sidebar;