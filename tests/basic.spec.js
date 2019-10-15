import { getBech32FromPK } from 'index.js';

test('check address conversion', async () => {
<<<<<<< HEAD
    const pkStr = "03a3c0c9b4630d51a985deabeec9a820c27c4d9eba1b17f38a9aa33cb4abd400a9";
    const pk = Buffer.from(pkStr, "hex");
    let addr = getBech32FromPK("terra", pk);
    expect(addr).toEqual("terra1a8xrqesz9m6xjlp2jvuyhnejx6dfhd0svpak6c");
=======
    const pkStr = "034fef9cd7c4c63588d3b03feb5281b9d232cba34d6f3d71aee59211ffbfe1fe87";
    const pk = Buffer.from(pkStr, "hex");
    let addr = getBech32FromPK("cosmos", pk);
    expect(addr).toEqual("cosmos1w34k53py5v5xyluazqpq65agyajavep2rflq6h");
>>>>>>> cee52c334407072d7d337487d0a0f9645c493cca
});
