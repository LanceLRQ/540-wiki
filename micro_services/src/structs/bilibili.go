package structs

type SpaceSearchAPIStruct struct {
	Code int 		`json:"code"`
	Message string 		`json:"message"`
	Data struct {
		List struct {
			VList []struct{
				Title string 	`json:"title"`
				Author string 	`json:"author"`
				BVID string		`json:"bvid"`
				AVID int		`json:"aid"`
			}	`json:"vlist"`
		}	`json:"list"`
		Page struct {
			Count 		int 	`json:"count"`
			PageNumber 	int 	`json:"pn"`
			PageLimit 	int 	`json:"ps"`
		}	`json:"page"`
	} 	`json:"data"`
}