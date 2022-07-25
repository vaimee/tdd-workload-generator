const axios = require('axios');

class ThingDirectoryClient {
  #url = process.env.THING_DIRECTORY_URL;
  #auth = {
    email: process.env.AUTH_EMAIL,
    password: process.env.AUTH_PASSWORD,
  };
  #options = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  async #authenticate(url) {
    const response = await axios.post(url, this.#auth, this.#options);
    if (!response.data.accessToken)
      throw Error('ACCESS TOKEN WAS NOT IN THE RESPONSE PAYLOAD');
    this.#options.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
  }

  async authRegister() {
    const authUrl = `${this.#url}/auth/register`;
    try {
      await this.#authenticate(authUrl);
    } catch (error) {
      console.log('*** REGISTRATION ERROR ***');
      console.log(error);
    }
  }

  async getAll() {
    const getAllUrl = `${this.#url}/things?enriched=true`;
    return await axios.get(getAllUrl, this.#options);
  }

  async delete(id) {
    const deleteUrl = `${this.#url}/things/${id}`;
    try {
      const response = await axios.delete(deleteUrl, this.#options);
      console.log(`${id} thing deleted`);
      return response;
    } catch (error) {
      if (error.response.status !== 401) {
        console.log(error.response);
        throw Error(error.response);
      }
      await this.authLogin();
      await this.delete(id);
    }
  }

  async authLogin() {
    const authUrl = `${this.#url}/auth`;
    try {
      await this.#authenticate(authUrl);
    } catch (error) {
      console.log('*** LOGIN ERROR ***');
      if (error.response.status == 401) await this.authRegister();
    }
  }

  async createThing(thing) {
    try {
      return thing.id
        ? await this.#createThingWithId(thing)
        : await this.#createThingAnomymous(thing);
    } catch (error) {
      switch (error.response.status) {
        case 401:
          await this.authLogin();
          await this.createThing(thing);
          break;
        case 400:
          console.error(`'${thing.title}' is an invalid thing. Skipping it...`);
          return false;
        default:
          throw Error(error);
      }
    }
  }

  async #createThingWithId(thing) {
    if (!thing.id) throw Error(`${thing.title} does not have an id`);
    const createThingUrl = `${this.#url}/things/${thing.id}`;
    await axios.put(createThingUrl, thing, this.#options);
    console.info(`${thing.title} successful created`);
    return true;
  }

  async #createThingAnomymous(thing) {
    const createThingUrl = `${this.#url}/things`;
    await axios.post(createThingUrl, thing, this.#options);
    console.info(`${thing.title} successful created`);
    return true;
  }
}

module.exports = {
  ThingDirectoryClient,
};
