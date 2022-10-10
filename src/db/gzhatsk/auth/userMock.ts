import {RoleEnum} from "../../../interfaces/gzhatsk/auth.interface";


export const userMock = {
    "et1rg4fsen98vdtk5nvd": {
        id: "et1rg4fsen98vdtk5nvd",
        login: "alex",
        email: "alex@mail.ru",
        password: "$2a$08$VLdy39AFWET0wHupBgDItOdI.Ol0ZqTVjAzvXa7rRb.GtuPGDsEqu",// 12345
        role: RoleEnum.user,
        nickName: '',
        avatar: null,
        isActivated: true,
        activationLink: ''
    },
    "aid9jsgq1gsmyme89g59": {
        id: "aid9jsgq1gsmyme89g59",
        login: "admin",
        email: "admin@mail.ru",
        password: "$2a$08$dvVn3bUUyr25e91g0Z.VYekVHoZoHfjlYD6quYTDGbhGfBYEO/lQO",// admin
        role: RoleEnum.admin,
        nickName: '',
        avatar: null,
        isActivated: true,
        activationLink: ''
    }
};