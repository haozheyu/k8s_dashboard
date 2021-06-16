import { Module } from 'vuex'
import UserFactoryStateTypes from './module'
import RootStateTypes from '../../module'

// Create a new store Modules.
const UserFactoryModule: Module<UserFactoryStateTypes, RootStateTypes> = {
  namespaced: true,
  state: {
    username: "",
    IsLogin: false,
  },
  mutations: {
    IsLogin(state: UserFactoryStateTypes, name:string) {
      state.username = name
      state.IsLogin = true
    },
    LogOut(state: UserFactoryStateTypes){
      state.username = ""
      state.IsLogin = false
    }
  },
  actions: {}
}

export default UserFactoryModule
