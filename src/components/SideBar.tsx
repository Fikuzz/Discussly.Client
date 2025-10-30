import { useState } from "react";
import CreateCommunityModal from "./community/NewCommunityModal";
import "./SideBar.css";
import { useNavigate } from "react-router-dom";
import CommunityService from "../services/communityService";
import type { CreateCommunity } from "../types/community";

const communitySvc = new CommunityService();

function SideBar () {
  const [communityModalIsOpen, setCommunityModal] = useState(false);
  const navigate = useNavigate();

  const OnCommunityCreate = async (community: CreateCommunity) => {
    try{
      const newcommunityId = await communitySvc.createCommunity(community);
      navigate(`/community/${newcommunityId}`);
    }
    catch(exeption)
    {
      console.log(exeption);
    }
  }

  return (
    <>
      <nav className="sidebar" aria-label="Основная навигация">
        <ul className="sidebar__menu">
          <li className="sidebar__item">
            <a onClick={() => navigate("/")} className="sidebar__link">
              <span className="sidebar__icon">🏠</span>
              <span className="sidebar__text">Главная</span>
            </a>
          </li>
          <li className="sidebar__item">
            <a onClick={() => navigate("/community")} className="sidebar__link">
              <span className="sidebar__icon">👥</span>
              <span className="sidebar__text">Сообщества</span>
            </a>
          </li>
          <li className="sidebar__item">
            <button className="sidebar__button" onClick={() => setCommunityModal(true)}>
              <span className="sidebar__icon">➕</span>
              <span className="sidebar__text">Создать сообщество</span>
            </button>
          </li>
          <li className="sidebar__divider" role="separator"></li>
          <li className="sidebar__item">
            <a onClick={() => navigate("/profile")} className="sidebar__link">
              <span className="sidebar__icon">👤</span>
              <span className="sidebar__text">Мой профиль</span>
            </a>
          </li>
          <li className="sidebar__item">
            <a onClick={() => navigate("/settings")} className="sidebar__link">
              <span className="sidebar__icon">⚙️</span>
              <span className="sidebar__text">Настройки</span>
            </a>
          </li>
        </ul>
      </nav>
      <CreateCommunityModal
        isOpen={communityModalIsOpen}
        onClose={() => setCommunityModal(false)}
        onCreate={(com) => OnCommunityCreate(com)}
      />
    </>
  )
}

export default SideBar;