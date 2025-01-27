import Culqi from "culqi-node";

const culqi = new Culqi({
  privateKey: process.env.CULQI_SECRET_KEY,
});

export default culqi;