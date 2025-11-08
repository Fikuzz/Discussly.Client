import { DateUtils } from "../../utils/dateUtils";
import React, { useState, type MouseEvent } from "react";
import "./UserInfo.css"
import UserPopup from "./UserPopup";

interface UserInfoProps {
  user: {
    id: string;
    username: string;
    avatarFileName?: string;
  };
  createdAt: string;
}

const UserInfo: React.FC<UserInfoProps> = ({
    user, 
    createdAt
}) => {

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

    const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
        setMousePosition({
            x: e.clientX,
            y: e.clientY
        });
        e.stopPropagation();
    }

    const handleUserPopupOpen = () =>{
        setIsPopupOpen(true);
    } 

    const handleUserPopupClose = () =>{
        setIsPopupOpen(false);
    }

    return(
    <>
        <div className="post-author" onClick={handleContextMenu}>
            {user.avatarFileName ? (
                <img
                    src={`/avatars/${user.avatarFileName}`}
                    alt="Avatar" 
                    className="avatar-small"
                    onClick={handleUserPopupOpen}
                />
            ) : (
                <div 
                    className="avatar-placeholder-small"
                    onClick={handleUserPopupOpen}>
                        {user.username?.charAt(0).toUpperCase()}
                </div>
            )}
            <div className="author-info">
                <span className="author-name" onClick={handleUserPopupOpen}>{user.username}</span>
                <span className="post-date">{DateUtils.normalize(createdAt, "timeago")}</span>
            </div>
        </div>

        <UserPopup
            userId={user.id}
            isOpen={isPopupOpen}
            onClose={handleUserPopupClose}
            triggerPosition={mousePosition}
        />
    </>
    )
}

export default UserInfo;