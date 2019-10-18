<template>
  <div class="TerraLedger">
    <input
      id="webusb"
      v-model="transportChoice"
      type="radio"
      value="WebUSB"
    >
    <label for="webusb">WebUSB</label>
    &nbsp;
    <input
      id="u2f"
      v-model="transportChoice"
      type="radio"
      value="U2F"
    >
    <label for="u2f">U2F</label>
    <br><br>
    <!--
        Commands
    -->
    <button @click="getVersion">
      Get Version
    </button>
    &nbsp;
    <button @click="showAddress">
      Show Address
    </button>
    &nbsp;
    <button @click="signTx">
      Sign TX
    </button>
    <br><br>
    <div class="form-hdpath">
      <label>HD Path</label>
      <input v-model="hdpath">
    </div>
    <br>
    <div class="form-hdpath">
      <label>Transaction</label>
      <input v-model="tx">
    </div>
    <!--
        Commands
    -->
    <ul id="ledger-status">
      <li
        v-for="item in ledgerStatus"
        :key="item.index"
      >
        {{ item.msg }}
      </li>
    </ul>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
// eslint-disable-next-line import/no-extraneous-dependencies
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import _ from 'lodash';
import Signature from 'elliptic/lib/elliptic/ec/signature';
import TerraApp from '../../src';

/* eslint-disable new-cap */
const LUNA_HD_PATH = "m/44'/330'/0'/0/0";
export default {
    name: 'TerraLedger',
    props: {
    },
    data() {
        return {
            deviceLog: [],
            transportChoice: 'WebUSB',
            hdpath: LUNA_HD_PATH,
            tx: '',
        };
    },
    computed: {
        ledgerStatus() {
            return this.deviceLog;
        },
    },
    methods: {
        log(msg) {
            this.deviceLog.push({
                index: this.deviceLog.length,
                msg,
            });
        },
        async getTransport() {
            let transport = null;

            this.log(`Trying to connect via ${this.transportChoice}...`);
            if (this.transportChoice === 'WebUSB') {
                try {
                    transport = await TransportWebUSB.create();
                } catch (e) {
                    this.log(e);
                }
            }

            if (this.transportChoice === 'U2F') {
                try {
                    transport = await TransportU2F.create(10000);
                } catch (e) {
                    this.log(e);
                }
            }

            return transport;
        },
        async getVersion() {
            this.deviceLog = [];

            // Given a transport (U2F/HIF/WebUSB) it is possible instantiate the app
            const transport = await this.getTransport();
            const app = new TerraApp(transport);

            // now it is possible to access all commands in the app
            const response = await app.getVersion();
            if (response.return_code !== 0x9000) {
                this.log(`Error [${response.return_code}] ${response.error_message}`);
                return;
            }

            this.log('Response received!');
            this.log(`App Version ${response.major}.${response.minor}.${response.patch}`);
            this.log(`Device Locked: ${response.device_locked}`);
            this.log(`Test mode: ${response.test_mode}`);
            this.log('Full response:');
            this.log(response);
        },
        async showAddress() {
            this.deviceLog = [];

            // Given a transport (U2F/HIF/WebUSB) it is possible instantiate the app
            const transport = await this.getTransport();
            const app = new TerraApp(transport);

            // now it is possible to access all commands in the app
            const path = this.getHDPath();
            const response = await app.getAddressAndPubKey(path, 'terra');

            if (response.return_code !== 0x9000) {
                this.log(`Error [${response.return_code}] ${response.error_message}`);
                return;
            }

            this.log('Response received!');
            this.log('\n');
            this.log(`Address:  ${response.bech32_address}`);
            this.log(`PublicKey: ${response.compressed_pk.toString('hex')}`);
        },
        async signTx() {
            /* eslint-disable no-alert, no-console */
            if (!this.tx) {
                alert('Transaction field is empty.');
                return;
            }

            let unsortedTx = {};
            try {
                unsortedTx = JSON.parse(this.tx);
            } catch (e) {
                alert('Transaction data must be JSON Object string!');
                return;
            }

            const sortedTx = this.sortAllKeys(unsortedTx);

            this.deviceLog = [];

            // Given a transport (U2F/HIF/WebUSB) it is possible instantiate the app
            const transport = await this.getTransport();
            const app = new TerraApp(transport);

            // now it is possible to access all commands in the app
            const path = this.getHDPath();
            const respAddress = await app.getAddressAndPubKey(path, 'terra');

            if (respAddress.return_code !== 0x9000) {
                this.log(`Cannot get address [${respAddress.return_code}] ${respAddress.error_message}`);
                return;
            }

            const message = JSON.stringify(sortedTx);
            const respSig = await app.sign(path, message);
            
            this.log('Response received!');

            if(respSig) {
                const signature = new Signature(respSig.signature.toString('hex'), 'hex');
                const rs = Buffer.from(signature.r.toString(16).padStart(64, '0') + signature.s.toString(16).padStart(64, '0'), 'hex');

                const json = {
                    signature: rs.toString('base64'),
                    pub_key: {
                        type: 'tendermint/PubKeySecp256k1',
                        value: respAddress.compressed_pk.toString('base64'),
                    },
                };

                this.log(' ');
                this.log(`Signer:  ${respAddress.bech32_address}`);
                this.log(`JSON:`);
                this.log(`${JSON.stringify(json)}`);
            }
        },
        getHDPath() {
            let path = this.hdpath.split('/');

            if (!path || path.length < 4 || path[0] !== 'm') {
                path = LUNA_HD_PATH;
            }

            const seq = {
                purpose: Number(path[1].replace("'", '')),
                coinType: Number(path[2].replace("'", '')),
                account: Number(path[3].replace("'", '')),
                change: Number(path[4]),
                index: Number(path[5]),
            };

            return [
                seq.purpose,
                seq.coinType,
                seq.account,
                seq.change,
                seq.index,
            ];
        },
        sortAllKeys(_object) {
            /* eslint-disable no-restricted-syntax, no-continue, guard-for-in */
            const object = _(_object)
                .toPairs()
                .sortBy(0)
                .fromPairs()
                .value();

            for (const key in object) {
                const o = object[key];
                if(!o)
                    continue;

                if (typeof o !== 'object') {
                    continue;
                }

                if (Array.isArray(o)) {
                    for (const i in o) {
                        const oo = o[i];
                        if (typeof oo !== 'object') {
                            continue;
                        }

                        o[i] = this.sortAllKeys(oo);
                    }
                } else {
                    object[key] = this.sortAllKeys(o);
                }
            }

            return object;
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    button {
        padding: 5px;
        font-weight: bold;
        font-size: medium;
    }

    ul {
        padding: 10px;
        text-align: left;
        alignment: left;
        list-style-type: none;
        background: black;
        font-weight: bold;
        color: greenyellow;
    }

    .form-hdpath > label {
        font-weight: bold;
    }

    .form-hdpath > input {
        padding: 4px;
        border: 1px solid black;
        border-radius: 4px;
        font-size: 16px;
        margin-left: 10px;
    }

</style>
