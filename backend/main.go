package main

import (
	"fmt"

	"cetoolbox.com/config"
	"cetoolbox.com/handlers"
)

func main() {
	handlers.StartServer(fmt.Sprintf("%s:%s", config.Env["HOSTNAME"], config.Env["PORT"]))
}
