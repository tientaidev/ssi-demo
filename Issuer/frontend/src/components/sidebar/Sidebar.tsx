import './sidebar.css'
import { TaskOutlined, NumbersOutlined } from '@mui/icons-material';

export function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <NumbersOutlined className="sidebarIcon" />
              DIDs
            </li>
            <li className="sidebarListItem">
              <TaskOutlined className="sidebarIcon" />
              VCs
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}