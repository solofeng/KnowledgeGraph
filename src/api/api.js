import axios from 'axios';

let base = '';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const uploadMock = params => { return axios.get(`${base}/info/upload`, { params: params }); };

export const getInfoList = params => { return axios.get(`${base}/info/list`, { params: params }); };

export const getInfoListPage = params => { return axios.get(`${base}/info/listpage`, { params: params }); };

export const countYear = params => { return axios.get(`${base}/info/countYear`, { params: params }); };

export const countSex = params => { return axios.get(`${base}/info/countSex`, { params: params }); };

export const countBirth = params => { return axios.get(`${base}/info/countBirth`, { params: params }); };

export const countGraduate = params => { return axios.get(`${base}/info/countGraduate`, { params: params }); };

export const countArea = params => { return axios.get(`${base}/info/countArea`, { params: params }); };
