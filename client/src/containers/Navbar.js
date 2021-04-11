import React from 'react';
import UserMenuModal from '../components/UserMenuModal';
import CalendarMenu from '../components/GoogleCalendarModal';
import { Input, Modal, Popup } from 'semantic-ui-react';
import { Search } from '@material-ui/icons';
import styles from '../styles/Navbar.module.scss';
import decode from 'jwt-decode';
import { useQuery } from '@apollo/client';
import { GET_TEAM_ADMIN_QUERY } from '../graphql/quereis';

function Navbar({ teamKey }) {
    const { data } = useQuery(GET_TEAM_ADMIN_QUERY, {
        variables: {
            teamKey: teamKey
        }
    });
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
                <div className={styles.calendar_button}>
                    <CalendarMenu />
                </div>
            </div>

            <div className={styles.nav_right}>
                <Popup
                    trigger={<div><UserMenuModal userId={userId} teamData={data.getTeam} /></div>}
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
};

export default Navbar;
