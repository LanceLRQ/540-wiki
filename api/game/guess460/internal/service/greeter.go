package service

import (
	"context"
	"fmt"

	"github.com/go-kratos/kratos/v2/errors"
	"github.com/go-kratos/kratos/v2/log"
	v1 "guess460/api/helloworld/v1"
	"guess460/internal/biz"
)

// GreeterService is a greeter service.
type GreeterService struct {
	v1.UnimplementedGreeterServer

	uc  *biz.GreeterUsecase
	log *log.Helper
}

// NewGreeterService new a greeter service.
func NewGreeterService(uc *biz.GreeterUsecase, logger log.Logger) *GreeterService {
	fmt.Println("AA")
	return &GreeterService{uc: uc, log: log.NewHelper(logger)}
}

// SayHello implements helloworld.GreeterServer
func (s *GreeterService) SayHello(ctx context.Context, in *v1.HelloRequest) (*v1.HelloReply, error) {
	s.log.Infof("SayHello Received: %v", in.GetName())
	if in.GetName() == "error" {
		return nil, errors.NotFound(v1.ErrorReason_USER_NOT_FOUND.String(), in.GetName())
	}
	return &v1.HelloReply{Message: "Hello " + in.GetName()}, nil
}
