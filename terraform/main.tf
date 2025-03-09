provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_cloud_run_service" "dagbok_service" {
  name     = "dagbok-pro-service"
  location = var.region
  project  = var.project_id

  template {
    spec {
      containers {
        image = var.container_image
        env {
          name  = "ALLOWED_HOSTS"
          value = var.allowed_hosts
        }
        env {
          name  = "DEBUG"
          value = "False"
        }
        env {
          name = "DJANGO_SECRET_KEY"
          value_from {
            secret_key_ref {
              name = "DJANGO_SECRET_KEY"
            }
          }
        }
      }
      timeout_seconds = 600
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service_iam_member" "all_users" {
  location = var.region
  project  = var.project_id
  service  = google_cloud_run_service.dagbok_service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "service_url" {
  value = google_cloud_run_service.dagbok_service.status[0].url
}
