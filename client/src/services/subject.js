import request from '_utils/request'

export const getAll = () => request().get(['subjects'])
