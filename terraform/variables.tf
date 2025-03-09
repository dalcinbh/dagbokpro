variable "project_id" {
  description = "ID do projeto no Google Cloud"
  type        = string
  default     = "dagbokj"
}

variable "region" {
  description = "Região do Cloud Run"
  type        = string
  default     = "us-central1"
}

variable "container_image" {
  description = "Imagem Docker a ser usada no Cloud Run"
  type        = string
  default     = "us-central1-docker.pkg.dev/dagbokj/dagbok-repo/dagbok-pro-backend:latest"
}

variable "allowed_hosts" {
  description = "Hosts permitidos para a aplicação"
  type        = string
  default     = "dagbok.pro,www.dagbok.pro,dagbok-pro-service-996128961660.us-central1.run.app"
}

variable "django_secret_key" {
  description = "Secret key para o Django"
  type        = string
}
