import {AppInfoModel} from "../models/AppInfoModel.ts";

export class InfoController {
    getAppInfo(): AppInfoModel {
        // Hard-coded information about the application
        return {
            developerName: "Mockachino (Aryan Alipour)", // Replace with actual developer name
            emailAddress: "your.email@example.com", // Replace with actual email
            appName: "WinMSS Buddy",
            appVersion: "1.0.0",
            appDescription: "A tool designed to help analyze and manage shooting match data from WinMSS files.",
            socialMediaLinks: {
                facebook: "https://facebook.com/mockainthechino", // Replace with actual link
                instagram: "https://instagram.com/mockainthechino", // Replace with actual link
                youtube: "https://youtube.com/mockainthechino", // Replace with actual link
            },
        };
    }
}
