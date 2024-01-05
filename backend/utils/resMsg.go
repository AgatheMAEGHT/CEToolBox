package utils

type ResMsg struct {
	Msg string `json:"msg"`
}

func NewResMsg(msg string) *ResMsg {
	return &ResMsg{
		Msg: msg,
	}
}

func (r *ResMsg) ToJson() []byte {
	return []byte(`{"msg": "` + r.Msg + `"}`)
}
