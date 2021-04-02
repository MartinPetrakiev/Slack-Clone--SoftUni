import React from 'react';
import UserMenuModal from '../components/UserMenuModal';
import { Input, Modal, Popup } from 'semantic-ui-react';
import { Search } from '@material-ui/icons';
import styles from '../styles/Navbar.module.scss';
import decode from 'jwt-decode';

function Navbar() {
    let username = '';
    let userId = '';
    try {
        const token = localStorage.getItem('token');
        const { user } = decode(token);
        username = user.username;
        userId = user.id;
    } catch (error) { }
    return (
        <div className={styles.container}>
            <div className={styles.nav_left}>
                <Modal
                    className={styles.nav_search}
                    trigger={<button name="search">Search<Search /></button>}
                    header='Search channels'
                    content={
                        <div>
                            <Input fluid placeholder='# e.g. budget-talks ...' name='search' />
                        </div>
                    }
                    actions={[{ key: 'search', content: 'Search', positive: true, }]}
                />
            </div>

            <div className={styles.nav_right}>
                <Popup
                    trigger={<div><UserMenuModal userId={userId} /></div>}
                    content={username}
                    position='bottom right'
                    style={{
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: '600'
                    }}
                    inverted
                    size='mini'
                />
            </div>
        </div >
    );
}

export default Navbar;
