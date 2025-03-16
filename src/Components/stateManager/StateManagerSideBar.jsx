import React from "react";
import { ClipboardListIcon, ChartBarIcon, CogIcon, LogoutIcon, UserGroupIcon } from "@heroicons/react/outline";
import { HomeIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function StateManagerSideBar() {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.clear();
		navigate("/");
	};

	return (
		<SidebarContainer>
			{/* Navigation Section */}
			<Nav>
				<ul>

					<NavItem>
						<ChartBarIcon />
						<Link to="/statemanagerreports">
							<span>Results</span>
						</Link>
					</NavItem>
				</ul>
			</Nav>

			{/* Settings and Logout Section */}
			
				<ul>

					<NavItem onClick={handleLogout}>
						<LogoutIcon />
						<span>Sign Out</span>
					</NavItem>
				</ul>
			
		</SidebarContainer>
	);
}

const SidebarContainer = styled.div`
	background-color: #4f46e5;
	width: 256px;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	border-top-right-radius: 20px;
	border-bottom-right-radius: 20px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	z-index: 10;
`;

const Nav = styled.nav`
	ul {
		list-style: none;
		padding: 0;
	}
`;

const NavItem = styled.li`
	display: flex;
	align-items: center;
	padding: 10px;
	border-radius: 8px;
	transition: all 0.3s;
	color: #e5e7eb;
	font-size: 16px;
	cursor: pointer;

	svg {
		height: 24px;
		width: 24px;
		color: #e5e7eb;
	}

	a {
		margin-left: 10px;
		text-decoration: none;
		color: inherit;
		font-weight: 500;
	}

	&:hover {
		background-color: #6366f1;
		color: white;
		svg {
			color: white;
		}
	}
`;

const Settings = styled.div`
	ul {
		list-style: none;
		padding: 0;
	}

	margin-top: auto;
`;

