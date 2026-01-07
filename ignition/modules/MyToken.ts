import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MyTokenModule", (m) => {
  const token = m.contract("MyToken", ["My Token", "CLR", 18n]);
  return { counter: token };
});
