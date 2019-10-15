import { getBech32FromPK } from 'index.js';

test('check address conversion', async () => {
    const pkStr = "03a3c0c9b4630d51a985deabeec9a820c27c4d9eba1b17f38a9aa33cb4abd400a9";
    const pk = Buffer.from(pkStr, "hex");
    let addr = getBech32FromPK("terra", pk);
    expect(addr).toEqual("terra1a8xrqesz9m6xjlp2jvuyhnejx6dfhd0svpak6c");
});
