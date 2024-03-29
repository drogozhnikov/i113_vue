import axios from "axios";
import {authHeader, getServerUrl} from "@/components/auth/services/axios-helper";
import errorHandler from "@/components/microservices/utils/error-handler";
import userHelper from "@/components/auth/services/user.helper";
import {usePandaStore} from "@/components/microservices/panda/js/pandaStore";


const API_URL = 'api/panda/';

const API_ALL = 'all';
const API_PASSGEN = 'utils/passgen'
const API_SERVICE_TYPES = 'data/types'
const API_JSON_ADD = 'utils/upload-add';
const API_JSON_REPLACE = 'utils/upload-replace';

const SERVICE_NAME = 'Panda'

class PandaService {
  async getUnits() {
    try {
      const responseAccounts = await axios.get(getServerUrl() + API_URL + API_ALL, {headers: authHeader()});
      const responseData = await axios.get(getServerUrl() + API_URL + API_SERVICE_TYPES, {headers: authHeader()});
      usePandaStore().setAccounts(responseAccounts.data)
      usePandaStore().setTypes(responseData.data)
    } catch (e) {
      errorHandler.handle(e)
    }
  }

  async createAccount(account) {
    let user = userHelper.getUser();
    try {
      return await axios.post(getServerUrl() + API_URL, {
        userId: user.userId,
        name: account.name,
        account: account.account,
        mail: account.mail,
        password: account.password,
        link: account.link,
        type: account.type,
        description: account.description,
      }, {
        headers: authHeader()
      })
    } catch (e) {
      errorHandler.handle(e)
    }
  }

  async updateAccount(account) {
    let user = userHelper.getUser();
    try {
      return await axios.put(getServerUrl() + API_URL, {
        id: account.id,
        userId: user.userId,
        name: account.name,
        account: account.account,
        mail: account.mail,
        password: account.password,
        link: account.link,
        type: account.type,
        description: account.description,
      }, {
        headers: authHeader()
      })
    } catch (e) {
      errorHandler.handle(e)
    }
  }

  async uploadJSON(json, isReplace) {
    try {
      return await axios.post(getServerUrl() + API_URL + (isReplace ? API_JSON_REPLACE : API_JSON_ADD), json, {headers: authHeader()})
    } catch (e) {
      errorHandler.handle(e)
    }
  }

  convertAndValidateJson(json) {
    let unitNumber = 0;
    let objects = [];
    let failed = [];
    let user = userHelper.getUser();
    for (unitNumber; unitNumber < json.length; unitNumber++) {
      if (failed.length > 5) {
        break;
      }
      try {
        objects.push({
          userId: user.userId,
          name: json[unitNumber].name !== undefined ?
            json[unitNumber].name : failed.push("unit:" + (unitNumber + 1) + "-field:name"),
          account: json[unitNumber].account !== undefined ?
            json[unitNumber].account : failed.push("unit:" + (unitNumber + 1) + "-field:account"),
          mail: json[unitNumber].mail !== undefined ?
            json[unitNumber].mail : failed.push("unit:" + (unitNumber + 1) + "-field:mail"),
          password: json[unitNumber].password !== undefined ?
            json[unitNumber].password : failed.push("unit:" + (unitNumber + 1) + "-field:password"),
          link: json[unitNumber].link !== undefined ?
            json[unitNumber].link : failed.push("unit:" + (unitNumber + 1) + "-field:link"),
          type: json[unitNumber].type !== undefined ?
            json[unitNumber].type : failed.push("unit:" + (unitNumber + 1) + "-field:type"),
          description: json[unitNumber].description !== undefined ?
            json[unitNumber].description : failed.push("unit:" + (unitNumber + 1) + "-field:description"),
        })
      } catch (e) {
        console.log('ощибка')
        console.log(e)
      }
    }
    if (failed.length > 0) {
      return 'JSONTemplateError:' + failed
    } else {
      return objects
    }
  }

  async removeSelectedAccounts(selected) {
    try {
      return axios.post(getServerUrl() + API_URL + "/selected", selected, {headers: authHeader()})
    } catch (e) {
      errorHandler.handle(e)
    }
  }

  async generatePassword() {
    try {
      let result = await axios.get(getServerUrl() + API_URL + API_PASSGEN, {headers: authHeader()})
      usePandaStore().setNewPassword(result.data)
    } catch (e) {
      errorHandler.handle(e)
    }
  }

  getTemplateObject() {
    let template = [];
    for (let i = 0; i < 2; i++) {
      template.push({
          name: '',
          account: '',
          mail: '',
          password: '',
          link: '',
          type: 'TRASH',
          description: '',
        }
      )
    }
    return template
  }

  async getBackUp() {
    let backUpObjects = []
    try {
      let response = await axios.get(getServerUrl() + API_URL + API_ALL, {headers: authHeader()});
      let values = response.data
      for (let i = 0; i < values.length; i++) {
        backUpObjects.push(
          {
            name: values[i].name,
            account: values[i].account,
            mail: values[i].mail,
            password: values[i].password,
            link: values[i].link,
            type: values[i].type,
            description: values[i].description
          }
        )
      }
      return backUpObjects;
    } catch (e) {
      errorHandler.handle(e)
    }
  }

  getBackUpFileName() {
    return SERVICE_NAME + '_BackUp.json'
  }

}

export default new PandaService();
