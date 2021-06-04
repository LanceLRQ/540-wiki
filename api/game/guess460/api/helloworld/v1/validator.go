package v1

import "fmt"

func (hr *HelloRequest) Validator() error {
	return fmt.Errorf("hhhh" + hr.Name)
}
