package server

import (
	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/middleware"
	"github.com/go-kratos/kratos/v2/middleware/logging"
	"github.com/go-kratos/kratos/v2/middleware/recovery"
	"github.com/go-kratos/kratos/v2/middleware/tracing"
	"github.com/go-kratos/kratos/v2/transport/http"
	"guess460/api/helloworld"
	v1 "guess460/api/helloworld/v1"
	"guess460/internal/conf"
	"guess460/internal/service"
)

// NewHTTPServer new a HTTP server.
func NewHTTPServer(c *conf.Server, greeter *service.GreeterService, myhello *service.HelloworldService, logger log.Logger) *http.Server {
	var opts = []http.ServerOption{}
	if c.Http.Network != "" {
		opts = append(opts, http.Network(c.Http.Network))
	}
	if c.Http.Addr != "" {
		opts = append(opts, http.Address(c.Http.Addr))
	}
	if c.Http.Timeout != nil {
		opts = append(opts, http.Timeout(c.Http.Timeout.AsDuration()))
	}
	srv := http.NewServer(opts...)
	m := http.Middleware(
		middleware.Chain(
			recovery.Recovery(),
			tracing.Server(),
			logging.Server(logger),
		),
	)
	srv.HandlePrefix("/helloworld", v1.NewGreeterHandler(greeter, m))
	srv.HandlePrefix("/myhello", helloworld.NewHelloworldHandler(myhello, m))
	return srv
}
