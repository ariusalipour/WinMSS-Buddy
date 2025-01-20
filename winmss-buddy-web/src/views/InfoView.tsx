import React from "react";
import { InfoController } from '../controllers/InfoController';
import { AppInfoModel } from '../models'; // Import the AppInfoModel
import { FacebookOutlined, InstagramOutlined, YoutubeOutlined } from '@ant-design/icons'; // Import icons
import './InfoView.css'; // Import a CSS file for styling

const infoController = new InfoController();

const InfoView: React.FC = () => {
    const info: AppInfoModel = infoController.getAppInfo(); // Get app info from the controller

    return (
        <div className="info-container">
            <h2 className="info-title">{info.appName}</h2>
            <p className="info-description">{info.appDescription}</p>
            <p><strong>Version:</strong> {info.appVersion}</p>
            <p><strong>Developer:</strong> {info.developerName}</p>
            <p><strong>Email:</strong> {info.emailAddress}</p>
            <div className="social-media-links">
                <h3>Social Media Links:</h3>
                <ul>
                    {info.socialMediaLinks.facebook && (
                        <li>
                            <a href={info.socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer">
                                <FacebookOutlined /> Facebook
                            </a>
                        </li>
                    )}
                    {info.socialMediaLinks.instagram && (
                        <li>
                            <a href={info.socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer">
                                <InstagramOutlined /> Instagram
                            </a>
                        </li>
                    )}
                    {info.socialMediaLinks.youtube && (
                        <li>
                            <a href={info.socialMediaLinks.youtube} target="_blank" rel="noopener noreferrer">
                                <YoutubeOutlined /> YouTube
                            </a>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default InfoView;
