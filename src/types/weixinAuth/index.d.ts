declare module "weixinAuth" {
  interface Auth {
    getAuthorizeURL: any;
    processToken: any;
    getAccessToken: any;
    refreshAccessToken: any;
    getUser: any;
    _getUser: any;
    getUserByCode: any;
  }
}
