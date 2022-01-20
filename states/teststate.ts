import { atom } from "recoil"
import some from './some'
const one = some[1];
const teststate = atom({
    key:'teststate',
    default: one
})

export default teststate