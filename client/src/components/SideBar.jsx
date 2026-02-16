import "./sidebar.css";
export default function SideBar({ user }) {
    return (
        <div className="sidebar">
            <h3>{user.username}</h3>
        </div>
    );
}
