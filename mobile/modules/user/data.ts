// noPage
// withObject
import AsyncStorage from '@react-native-async-storage/async-storage';
import Storage from 'esoftplay/storage';

export default {
  register(name: string): void {
    AsyncStorage.getItem("user_data_dependent").then((x) => {
      let all: string[] = []
      if (x) {
        all = JSON.parse(x).filter((x) => x != name)
      }
      all.push(name)
      AsyncStorage.setItem("user_data_dependent", JSON.stringify(all))
    })
  },
  unregister(name: string): void {
    AsyncStorage.getItem("user_data_dependent").then((x) => {
      let all = []
      if (x) {
        all = JSON.parse(x).filter((x) => x != name)
      }
      AsyncStorage.setItem("user_data_dependent", JSON.stringify(all))
    })
  },
  deleteAll(): void {
    AsyncStorage.getItem("user_data_dependent").then((x) => {
      if (x) {
        const arx = JSON.parse(x)
        AsyncStorage.multiRemove(arx)
        arx.forEach((ix) => { Storage.removeItem(ix) })
      }
    })
  }
}