import Vue from 'vue'
import Router from 'vue-router'
import Portal from '@/components/portal'
import Home from '@/components/home/home'
import SearchResult from '@/components/home/search_result'
import MyPage from '@/components/home/mypage'
import DocManage from '@/components/home/doc_manage'
import DictManage from '@/components/home/dict_manage'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home,
			children: [
                {
                    path: '/',
                    name: 'Portal',
                    component: Portal
                },
                {
                    path: '/searchresult',
                    name: 'SearchResult',
                    component: SearchResult
                },
                {
                    path: '/mypage',
                    name: 'MyPage',
                    component: MyPage
                },
                {
                    path: '/docmanage',
                    name: 'DocManage',
                    component: DocManage
                },
                {
                    path: '/dictmanage',
                    name: 'DictManage',
                    component: DictManage
                }
			]
		}
		]
})
