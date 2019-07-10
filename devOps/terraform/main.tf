terraform {
  required_version = ">= 0.8"
}

# Set the variable value in *.tfvars file
# or using -var="do_token=..." CLI option
#variable "do_token =d85a75ba9696556f8d3a56df7fefbce5c34d9241b33caa07c5cc05ac01bfd6d0"

#-var="do_token=d85a75ba9696556f8d3a56df7fefbce5c34d9241b33caa07c5cc05ac01bfd6d0"
#-var="ssh_fingerprint=ed:b9:c8:25:59:17:1f:4d:67:bc:0a:0b:ee:6f:44:d1"
# sudo apt-key fingerprint 0EBFCD88
# "sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D",
# "sudo sh -c 'echo \"deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\" > /etc/apt/sources.list.d/docker.list'",

variable "image" {
  default = "ubuntu-18-04-x64"
}
variable "region" {
  default = "nyc1"
}

# si descomento la linea me pedira el valor d ela variable por consola
# variable "dns_subdomain" { /* provided elsewhere (e.g. TF_VAR_dns_subdomain environment variable) */ }

variable "kube_host_size" {
  default = "4gb" # AF: This can't be smaller than 2gb or RKE freaks out when Kubernetes runs out of memory.
}

variable "kube_host_count" {
  default = 3
}

variable "docker_version" {
  default = "5:18.09.6~3-0~ubuntu-bionic"
}

variable "ssh_key_file" {
	default= "/etc/ssh/ssh_host_rsa_key_2"
}

variable "ssh_public_key_file" {
	default= "/etc/ssh/ssh_host_rsa_key_2.pup"
}

variable "do_token" {
	description = "token para conectarme al api del proveedor"
	default = "d85a75ba9696556f8d3a56df7fefbce5c34d9241b33caa07c5cc05ac01bfd6d0"
}

variable "ip_centro" {
	description = "IP q dio tvcable a la ofician del centro donde funciona el servidor"
	default = "186.68.140.211"
}

variable "ssh_fingerprint" {
	description = "el ssh q se usara paa conectarce por ruc q esta definido en el sito del proveedor"
	default = "ed:b9:c8:25:59:17:1f:4d:67:bc:0a:0b:ee:6f:44:d1"
}

variable "ssh_fingerprint2" {
	description = "el ssh q se usara paa conectarce por ruc q esta definido en el sito del proveedor"
	default = "81:57:4a:ee:97:bb:18:bd:40:25:fd:8b:d1:db:31:a5"
}

variable "ssh_fingerprint3" {
	description = "el ssh q se usara paa conectarce por ruc q esta definido en el sito del proveedor"
	default = "79:3b:a6:26:20:40:84:8c:68:17:a9:c0:ee:81:3d:03"
}

# Configure the DigitalOcean Provider
provider "digitalocean" {
  token = "${var.do_token}"
}

# https://developers.digitalocean.com/documentation/changelog/api-v2/new-size-slugs-for-droplet-plan-changes/
# https://discoposse.com/2017/02/08/adding-ssh-access-for-digitalocean-when-using-terraform/
# https://www.digitalocean.com/community/tutorials/how-to-use-terraform-with-digitalocean
# Create a web server
resource "digitalocean_droplet" "bot-visita" {
    image = "${var.image}"
    name = "bot-visita"
    region = "${var.region}"
	size = "s-1vcpu-1gb"
    private_networking = true
	monitoring = true
    ssh_keys =  [
      "${var.ssh_fingerprint}","${var.ssh_fingerprint2}","${var.ssh_fingerprint3}"
    ]

	user_data = <<-EOF
		#!/bin/bash
		cd /home
		echo "Hello, World" > index.html
		EOF
}

output "address_web" {
	value = "${digitalocean_droplet.bot-visita.ipv4_address}"
}

resource "digitalocean_firewall" "bot-visita" {
  name = "bot-visita"

  droplet_ids = ["${digitalocean_droplet.bot-visita.id}"]

  inbound_rule {
      protocol           = "tcp"
      port_range         = "22"
      source_addresses   = ["${var.ip_centro}"]
  }

  inbound_rule {
      protocol           = "tcp"
      port_range         = "22445"
      source_addresses   = ["${var.ip_centro}"]
  }

  # docker port
  inbound_rule {
      protocol           = "tcp"
      port_range         = "2377"
      source_addresses   = ["0.0.0.0/0", "::/0"]
  }
  inbound_rule {
    protocol           = "tcp"
    port_range         = "4000"
    source_addresses   = ["0.0.0.0/0", "::/0"]
  }
  inbound_rule {
    protocol           = "tcp"
    port_range         = "5000"
    source_addresses   = ["0.0.0.0/0", "::/0"]
  }
  inbound_rule {
    protocol           = "tcp"
    port_range         = "80"
    source_addresses   = ["0.0.0.0/0", "::/0"]
  }
  inbound_rule {
    protocol           = "tcp"
    port_range         = "9090"
    source_addresses   = ["${var.ip_centro}"]
  }
  inbound_rule {
      protocol           = "tcp"
      port_range         = "3000"
      source_addresses   = ["0.0.0.0/0", "::/0"]
  }
  inbound_rule {
      protocol           = "tcp"
      port_range         = "7946"
      source_addresses   = ["0.0.0.0/0", "::/0"]
  }
  inbound_rule {
      protocol           = "udp"
      port_range         = "7946"
      source_addresses   = ["0.0.0.0/0", "::/0"]
  }
  inbound_rule {
      protocol           = "udp"
      port_range         = "4789"
      source_addresses   = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
      protocol                = "tcp"
      port_range              = "all"
      destination_addresses   = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
      protocol                = "udp"
      port_range              = "all"
      destination_addresses   = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
      protocol                = "icmp"
      destination_addresses   = ["0.0.0.0/0", "::/0"]
  }
}
