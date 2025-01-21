export interface AppInfoModel {
    developerName: string;
    emailAddress: string;
    appName: string;
    appVersion: string;
    appDescription: string;
    socialMediaLinks: {
        facebook?: string;
        instagram?: string;
        youtube?: string;
    };
}