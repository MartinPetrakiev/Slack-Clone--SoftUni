import { InfoOutlined } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import ChatInput from '../components/ChatInput';
import Messages from '../components/Messages';
import { useLazyQuery } from '@apollo/client';
import { GET_CHANNEL_QUERY } from '../graphql/quereis';
import AddTopicModal from '../components/AddTopicModal';
import { Icon } from 'semantic-ui-react';
import styles from '../styles/Chat.module.scss';

function Chat({ channelKey }) {
    const [channelData, setChannelData] = useState({
        channelId: '',
        channelName: '',
        topic: ''
    });

    const [getChannels, { loading, error, data }] = useLazyQuery(GET_CHANNEL_QUERY, {
        variables: {
            channelKey
        },
    });

    useEffect(() => {
        if (channelKey) {
            getChannels();
            if (data && data.hasOwnProperty('getChannel')) {
                const { getChannel } = data;
                setChannelData((oldState) => ({
                    ...oldState,
                    channelId: Number(getChannel.id),
                    channelName: getChannel.name,
                    topic: getChannel.topic
                }));
            }
        }
    }, [channelKey, getChannels, data]);

    const showDetails = () => {

    };

    if (error) return (
        <div className={styles.container}>
            <div className={styles.header}>Select a channel</div>
        </div>
    );

    return (
        <div className={styles.container}>
            {loading && (<div className={styles.loading}>  <Icon loading name='spinner' size="big" /></div>)}
            {data && channelData.channelName ? (
                <>
                    <div className={styles.header}>
                        <div className={styles.header_left}>
                            <h4><strong># {channelData.channelName}</strong></h4>
                            <div>{channelData.topic ? channelData.topic : (<AddTopicModal channelKey={channelKey} channelId={channelData.channelId} />)}</div>
                        </div>
                        <div className={styles.header_right}>
                            <div onClick={showDetails}>
                                <InfoOutlined />
                            </div>
                        </div>
                    </div>
                    <div className={styles.messages}>
                        <Messages channelId={channelData.channelId} />
                    </div>
                    <ChatInput
                        channelName={channelData.channelName}
                        channelId={channelData.channelId}
                    />
                </>
            ) : (
                <div className={styles.header}>Select a channel</div>
            )}

        </div>
    );
}

export default Chat;
