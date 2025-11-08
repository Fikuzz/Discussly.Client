import { useEffect, useState } from "react";
import "./UserPopup.css"
import type { Profile } from "../../types/user";
import { userService } from "../../services/userService";
import { DateUtils } from "../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

interface UserPopupProps {
    userId: string;
    isOpen: boolean;
    onClose: () => void;
    triggerPosition?: { x: number; y: number };
}

const UserPopup: React.FC<UserPopupProps> = ({
    userId,
    isOpen,
    onClose,
    triggerPosition
}) => {
    const navigate = useNavigate();

    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        const fetchProfile = async() =>{
            try{
                const fetchedProfile = await userService.getUserById(userId);
                setProfile(fetchedProfile);
            }
            catch(exeption)
            {
                console.log(exeption);
            }
        }

        if (isOpen && triggerPosition) {
          setPosition({
            top: triggerPosition.y,
            left: triggerPosition.x
            });

            fetchProfile();
        }

    }, [isOpen, triggerPosition, userId]);

    const handleProfile = () =>{
        navigate(`../profile/${userId}`);
    }

    const handleOnClose = (e: MouseEvent) =>{
        e.stopPropagation();
        onClose();
    }

    if(!isOpen) return null;

    return(
        <div className="popup-overlay" onClick={(e) => handleOnClose(e)}>
            <div className="popup-content" style={{top: position.top, left: position.left}} onClick={(e) => e.stopPropagation()}>
                <div className="user-main">
                    {profile?.avatarFileName ? (
                        <img
                            src={`/avatars/${profile?.avatarFileName}`}
                            alt="Avatar" 
                            className="avatar-small"
                            onClick={handleProfile}
                        />
                    ) : (
                        <div 
                            className="avatar-placeholder-small"
                            onClick={handleProfile}>
                                {profile?.username?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="user-info">
                        <span className="author-name" onClick={handleProfile}>{profile?.username}</span>
                        <span className="post-date">{profile && DateUtils.normalize(profile?.createdAt, "date")}</span>
                    </div>
                </div>
                <div>
                    <span>Карма: {profile?.karma}</span>
                </div>
            </div>
        </div>
    )
}

export default UserPopup;