import Index from "../pages/Index.vue";
import TeamPage from "../pages/TeamPage.vue";
import SearchPage from "../pages/SearchPage.vue";
import UserEditPage from "../pages/UserEditPage.vue";
import UserLoginPage from "../pages/UserLoginPage.vue";
import SearchResultPage from "../pages/SearchResultPage.vue";
import TeamAddPage from "../pages/TeamAddPage.vue";
import TeamUpdatePage from "../pages/TeamUpdatePage.vue";
import UserUpdatePage from "../pages/UserUpdatePage.vue";
import UserPage from "../pages/UserPage.vue";
import UserTeamCreatePage from "../pages/UserTeamCreatePage.vue";
import UserTeamJoinPage from "../pages/UserTeamJoinPage.vue";


const routes = [
    {path: '/', component: Index},
    {path: '/team', component: TeamPage},
    {path: '/team/add', component: TeamAddPage},
    {path: '/team/update', component: TeamUpdatePage},
    {path: '/user', component: UserPage},
    {path: '/user/login', component: UserLoginPage},
    {path: '/user/edit', component: UserEditPage},
    {path: '/user/list', component: SearchResultPage},
    {path: '/user/search', component: SearchResultPage},
    {path: '/user/update', component: UserUpdatePage},


    {path: '/user/team/create', component: UserTeamCreatePage},
    {path: '/user/team/join', component: UserTeamJoinPage},

    {path: '/search', component: SearchPage},


]

export default routes


