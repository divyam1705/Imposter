import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';

// Initialize NFC Manager
export const initNFC = async () => {
  await NfcManager.start();
};

// Function to read NFC card
export const readNFC = async () => {
  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const tag = await NfcManager.getTag();
    console.log('Tag data:', tag);
    return tag;
  } catch (error) {
    console.warn('NFC Read Error:', error);
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
};

// Function to write NFC card
export const writeNFC = async text => {
  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const bytes = Ndef.encodeMessage([Ndef.textRecord(text)]);
    if (bytes) {
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      console.log('NFC write success!');
    }
  } catch (error) {
    console.warn('NFC Write Error:', error);
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
};
