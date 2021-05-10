package views

import (
        "fmt"
	"github.com/kataras/iris/v12"
	"io/ioutil"
	"micro_services/src/structs"
	"micro_services/src/utils"
	"net/http"
)

func bilibiliApiFailed(ctx iris.Context) {
	ctx.JSON(structs.RESTfulAPIResult{
		Status: false,
		Message: "调用B站接口失败",
	})
}

func querySpaceList (mid int, page int) (*structs.SpaceSearchAPIStruct, error)  {
	apiUrl := "https://api.bilibili.com/x/space/arc/search?mid=%d&ps=1&tid=0&pn=%d&keyword=&order=pubdate&jsonp=jsonp"
	resp, err := http.Get(fmt.Sprintf(apiUrl, mid, page))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	spData := structs.SpaceSearchAPIStruct{}
	parseOk := utils.JSONStringByteToObject(body, &spData)
	if !parseOk {
		return nil, fmt.Errorf("parse json failed")
	}
	return &spData, nil
}

func GetFirstVideoView(ctx iris.Context) {
	mid, err := ctx.URLParamInt("mid")
	if err != nil {
		ctx.JSON(structs.RESTfulAPIResult{
			Status: false,
			Message: "请输入正确的B站ID",
		})
		return
	}

	spData, err := querySpaceList(mid, 1)
	if err != nil || spData.Code != 0 {
		bilibiliApiFailed(ctx)
		return
	}

	if spData.Data.Page.Count <= 0 {
		ctx.JSON(structs.RESTfulAPIResult{
			Status: false,
			Message: "TA还没有投稿哦！",
		})
	} else if spData.Data.Page.Count == 1 {
		ctx.JSON(structs.RESTfulAPIResult{
			Status: true,
			Message: "",
			Data: spData.Data.List.VList[0],
		})
	} else {
		spData, err = querySpaceList(mid, spData.Data.Page.Count)
		if err != nil || spData.Code != 0 {
			bilibiliApiFailed(ctx)
			return
		}
		ctx.JSON(structs.RESTfulAPIResult{
			Status: true,
			Message: "",
			Data: spData.Data.List.VList[0],
		})
	}
}
