import { useEffect, useState } from "react";
import communityService from "../../services/communityService";
import type { Member } from "../../types/community";
import { DateUtils } from "../../utils/dateUtils";
import "./MembersTab.css";

const CommunitySvc = new communityService();

interface MembersTabProps {
    communityId: string | undefined;
    isModerator: boolean;
}

const MembersTab: React.FC<MembersTabProps> = ({ isModerator, communityId }) => {
    const [members, setMembers] = useState<Member[]>();

    useEffect (() => {
        const fetchMembers = async () =>{
            try{
                if(communityId)
                {
                    const fetchcdMembers = await CommunitySvc.getSubscriptions(communityId);
                    setMembers(fetchcdMembers);
                    console.log(members);
                }
            }
            catch(exeption)
            {
                console.log(exeption);
            }
        }

        fetchMembers();
    }, [])
    
return(
    <div className="members-tab">
        <div className="section-header">
            <h3>Участники сообщества</h3>
            <div className="search-box">
                <input type="text" placeholder="Поиск участников..." />
            </div>
        </div>
          
          <div className="users-grid">
            {members && members.map(member => (
              <div key={member.user.id} className="user-card">
                <div className="user-avatar">
                    {member.user.avatarFileName ?
                    (<img
                        src={`/avatars/${member.user.avatarFileName}`}
                        alt="Avatar" 
                        className="avatar-l"
                    />) :
                    (
                        <div className="avatar-placeholder-l">
                            {member.user.username?.charAt(0).toUpperCase()}
                        </div>
                    )
                    }
                </div>
                <div className="user-name">{member.user.username}</div>
                <div className="user-join-date">В сообществе c {DateUtils.normalize(member.memberAt, "date")}</div>
                {isModerator && (
                    <button className="btn btn--danger btn--small">
                    Исключить
                    </button>
                )}
              </div>
            ))}
          </div>
        </div>
)};

export default MembersTab;