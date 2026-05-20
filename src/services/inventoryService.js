import axios from "axios";
import { NODES } from "./api";

export const getInventoryProducts =
  async (nodeKey) => {

    const node = NODES[nodeKey];

    if (!node) {
      throw new Error(
        "Nodo inválido"
      );
    }

    const response =
      await axios.get(
        `${node.url}/api/${node.endpoint}/productos`
      );

    return response.data;
};