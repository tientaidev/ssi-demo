import './topbar.css'
import SettingsIcon from '@mui/icons-material/Settings';

export function TopBar() {
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">
            Issuer dashboard
          </span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <SettingsIcon />
          </div>
        </div>
      </div>
    </div>
  )
}