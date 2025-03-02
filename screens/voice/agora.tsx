// Import React Hooks
import React, { useRef, useState, useEffect } from 'react';

// Import user interface elements
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

// Import components related to obtaining Android device permissions
import { PermissionsAndroid, Platform } from 'react-native';

// Import Agora SDK
import {
    createAgoraRtcEngine,
    ChannelProfileType,
    ClientRoleType,
    IRtcEngine,
    RtcConnection,
    IRtcEngineEventHandler,
} from 'react-native-agora';


// Define basic information

const localUid = 0; // Local user Uid, no need to modify
const appId = 'bf757e929d184a1eb6241a993d14bf94';
const channelName = 'game_room';
const token =
    '007eJxTYJgxU2jjjJ6omPgbFp1d339K/xU+l3GgJH3e1KX/b86bvC1CgSEpzdzUPNXSyDLF0MIk0TA1yczIxDDR0tI4xdAkKc3SpEv8SHpDICPD803ZLIwMEAjiczKkJ+amxhfl5+cyMAAAyBwkRg==';
const AgoraApp = () => {
    const agoraEngineRef = useRef<IRtcEngine | null>(null); // IRtcEngine instance
    const [isJoined, setIsJoined] = useState(false); // Whether the local user has joined the channel
    const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
    const [message, setMessage] = useState(''); // User prompt message
    const eventHandler = useRef<IRtcEngineEventHandler | null>(null); // Implement callback functions

    useEffect(() => {
        const join = async () => {
            if (isJoined) {
                return;
            }
            try {
                // Join the channel as a broadcaster
                agoraEngineRef.current?.joinChannel(token, channelName, localUid, {
                    // Set channel profile to live broadcast
                    channelProfile: ChannelProfileType.ChannelProfileCommunication,
                    // Set user role to broadcaster
                    clientRoleType: ClientRoleType.ClientRoleBroadcaster,
                    // Publish audio collected by the microphone
                    publishMicrophoneTrack: true,
                    // Automatically subscribe to all audio streams
                    autoSubscribeAudio: true,
                });
            } catch (e) {
                console.log(e);
            }
        };
        const leave = () => {
            try {
                // Call leaveChannel method to leave the channel
                agoraEngineRef.current?.leaveChannel();
                setRemoteUid(0);
                setIsJoined(false);
                showMessage('Left the channel');
            } catch (e) {
                console.log(e);
            }
        };
        const init = async () => {
            await setupVoiceSDKEngine();
            setupEventHandler();
        };
        const timer = setTimeout(async () => {
            leave();
        }, 30000);
        init(); join();
        return () => {
            clearTimeout(timer);
            cleanupAgoraEngine(); // Ensure this is synchronous
        };
    }, [isJoined]); // Empty dependency array ensures it runs only once

    const setupEventHandler = () => {
        eventHandler.current = {
            onJoinChannelSuccess: () => {
                setMessage('Successfully joined channel: ' + channelName);
                setIsJoined(true);
            },
            onUserJoined: (_connection: RtcConnection, uid: number) => {
                setMessage('Remote user ' + uid + ' joined');
                setRemoteUid(uid);
            },
            onUserOffline: (_connection: RtcConnection, uid: number) => {
                setMessage('Remote user ' + uid + ' left the channel');
                setRemoteUid(uid);
            },
        };
        agoraEngineRef.current?.registerEventHandler(eventHandler.current);
    };

    const setupVoiceSDKEngine = async () => {
        try {
            if (Platform.OS === 'android') { await getPermission(); }
            agoraEngineRef.current = createAgoraRtcEngine();
            const agoraEngine = agoraEngineRef.current;
            await agoraEngine.initialize({ appId: appId });
        } catch (e) {
            console.error(e);
        }
    };

    // Define the join method called after clicking the join channel button


    // Define the leave method called after clicking the leave channel button


    const cleanupAgoraEngine = () => {
        return () => {
            agoraEngineRef.current?.unregisterEventHandler(eventHandler.current!);
            agoraEngineRef.current?.release();
        };
    };

    // Render user interface
    return (
        <SafeAreaView style={styles.main}>
            {/* <Text style={styles.head}>Agora Voice SDK Quickstart</Text> */}
            <View style={styles.btnContainer}>
                {/* <Text onPress={join} style={styles.button}>
                    Join Channel
                </Text> */}
                {/* <Text onPress={leave} style={styles.button}>
                    Leave Channel
                </Text> */}
            </View>
            {isJoined ? (
                <Text>You joined</Text>
            ) : (
                <Text>Join a channel</Text>
            )}
            {isJoined && remoteUid !== 0 ? (
                <Text>{remoteUid} joined</Text>
            ) : (
                <Text>{isJoined ? 'Waiting for remote user to join' : ''}</Text>
            )}
            <View style={styles.messageContainer}>
                <Text style={styles.info}>{message}</Text>
            </View>
        </SafeAreaView>
    );

    // Display information
    function showMessage(msg: string) {
        setMessage(msg);
    }
};

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 25,
        paddingVertical: 4,
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#0055cc',
        margin: 5,
    },
    main: {
        backgroundColor: '#f0f0f0',
        flex: 1,
        alignItems: 'center',
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    head: {
        fontSize: 20,
    },
    messageContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    info: {
        backgroundColor: '#ffffe0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        color: '#0000ff',
        textAlign: 'center',
    },
});

const getPermission = async () => {
    if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
    }
};

export default AgoraApp;
