import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';

// Pre-step, call this before any NFC operations
NfcManager.start();

export function NfcSample() {
    async function readNdef() {
        try {
            // register for the NFC tag with NDEF in it
            await NfcManager.requestTechnology(NfcTech.Ndef);
            // the resolved tag object will contain `ndefMessage` property
            const tag = await NfcManager.getTag();
            if (tag?.ndefMessage) {
                const ndefRecords = tag.ndefMessage;
                const text = Ndef.text.decodePayload(new Uint8Array(ndefRecords[0].payload));
                console.warn('Tag found', text);
            } else {
                console.warn('No NDEF message found');
            }
        } catch (ex) {
            console.warn('Oops!', ex);
        } finally {
            // stop the nfc scanning
            NfcManager.cancelTechnologyRequest();
        }
    }
    const writeNFC = async (text: string) => {
        try {
            await NfcManager.requestTechnology(NfcTech.Ndef);
            const bytes = Ndef.encodeMessage([Ndef.textRecord(text)]);
            if (bytes) {
                await NfcManager.ndefHandler.writeNdefMessage(bytes);
                console.log('NFC write success!');
            }
        } catch (error) {
            console.log('NFC Write Error:', error);
        } finally {
            NfcManager.cancelTechnologyRequest();
        }
    };
    return (
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={readNdef}>
                <Text style={{ color: 'white' }}>scan a Tag</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => writeNFC('87654321')}>
                <Text style={{ color: 'white' }}>Write Tag</Text>
            </TouchableOpacity> */}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default NfcSample;
