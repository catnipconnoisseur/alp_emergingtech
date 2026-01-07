import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TokenSaleModule", (m) => {
    const myToken = m.contract("MyToken", ["My Token", "CLR", 18n]);
    const tokenSale = m.contract("TokenSale", [myToken]); 

    const amount = 50n * 10n ** 18n;
    m.call(myToken, "transfer", [tokenSale, amount]);

    return { myToken, tokenSale };
});
