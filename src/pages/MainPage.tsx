import Sidebar from "../components/Sidebar";
import ChatsSection from "../components/ChatsSection";
import './MainPage.css'

const MainPage = () => {
  return (
    <div className="flex h-4/5 w-4/5 overflow-hidden max-w-5xl  shadow-xl mw">
      <Sidebar />
      <ChatsSection />
    </div>
  );
};

export default MainPage;
