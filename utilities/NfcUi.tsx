import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { initNFC, readNFC, writeNFC } from './nfcService';

const NFCExample = () => {
    useEffect(() => {
        initNFC();
    }, []);

    return (
        <View>
            <Text>NFC Example</Text>
            <Button title="Read NFC" onPress={async () => {
                const tag = await readNFC();
                console.log(JSON.stringify(tag));
            }} />
            <Button title="Write NFC" onPress={() => writeNFC('12345678')} />
        </View>
    );
};

export default NFCExample;
