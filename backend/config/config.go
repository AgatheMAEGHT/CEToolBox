package config

import "os"

var (
	Env = map[string]string{
		"HOSTNAME": "localhost",
		"PORT":     "3000",
	}
)

func init() {
	for k := range Env {
		v := os.Getenv(k)
		if v != "" {
			Env[k] = v
		}
	}
}
