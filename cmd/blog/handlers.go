package main

import (
	"html/template"
	"log"
	"net/http"
)

type indexPage struct {
	Title           string
	FeaturedPosts   []featuredPostData
	MostRecentPosts []mostRecentPostData
}

type featuredPostData struct {
	Title       string
	Subtitle    string
	ImgModifier string
	Author      string
	AuthorImg   string
	PublishDate string
}

type mostRecentPostData struct {
	Title       string
	Subtitle    string
	ImgPost     string
	Author      string
	AuthorImg   string
	PublishDate string
}

func index(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("pages/index.html")
	if err != nil {
		http.Error(w, "Internet Server Error", 500)
		log.Println(err.Error())
		return
	}

	data := indexPage{
		Title:           "Escape",
		FeaturedPosts:   featuredPosts(),
		MostRecentPosts: mostRecentPosts(),
	}

	err = ts.Execute(w, data)
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}
}

func post(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("pages/post.html")
	if err != nil {
		http.Error(w, "Internet Server Error", 500)
		log.Println(err.Error())
		return
	}

	err = ts.Execute(w, nil)
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}
}

func featuredPosts() []featuredPostData {
	return []featuredPostData{
		{
			Title:       "The Road Ahead",
			Subtitle:    "The road ahead might be paved - it might not be.",
			ImgModifier: "featured-post_background_the-road-ahead",
			Author:      "Mat Vogels",
			AuthorImg:   "static/img/mat_vogels.png",
			PublishDate: "9/25/2015",
		},
		{
			Title:       "From Top Down",
			Subtitle:    "Once a year.",
			ImgModifier: "featured-post_background_from-top-down",
			Author:      "William Wong",
			AuthorImg:   "static/img/william_wong.png",
			PublishDate: "9/25/2015",
		},
	}
}

func mostRecentPosts() []mostRecentPostData {
	return []mostRecentPostData{
		{
			Title:       "Still Standing Tall",
			Subtitle:    "Life begins at the end of your comfort zone.",
			ImgPost:     "static/img/still_standing_tall.png",
			Author:      "William Wong",
			AuthorImg:   "static/img/william_wong.png",
			PublishDate: "9/25/2015",
		},
		{
			Title:       "Sunne Side Up",
			Subtitle:    "No place is ever as bad as they tell you it's going to be.",
			ImgPost:     "static/img/sunny_side_up.png",
			Author:      "Mat Vogels",
			AuthorImg:   "static/img/mat_vogels.png",
			PublishDate: "9/25/2015",
		},
		{
			Title:       "Water Falls",
			Subtitle:    "We travel not to escape life, but for life not to escape us.",
			ImgPost:     "static/img/water_falls.png",
			Author:      "Mat Vogels",
			AuthorImg:   "static/img/mat_vogels.png",
			PublishDate: "9/25/2015",
		},
		{
			Title:       "Through the mist",
			Subtitle:    "Travel makes you see what a tiny place you occupy in the world.",
			ImgPost:     "static/img/through_the_mist.png",
			Author:      "William Wong",
			AuthorImg:   "static/img/william_wong.png",
			PublishDate: "9/25/2015",
		},
		{
			Title:       "Awaked Early",
			Subtitle:    "Not all those who wander are lost.",
			ImgPost:     "static/img/awaked_early.png",
			Author:      "Mat Vogels",
			AuthorImg:   "static/img/mat_vogels.png",
			PublishDate: "9/25/2015",
		},
		{
			Title:       "Try It Always",
			Subtitle:    "The world is a book, and those who do not travel read only one page.",
			ImgPost:     "static/img/try_it_always.png",
			Author:      "Mat Vogels",
			AuthorImg:   "static/img/mat_vogels.png",
			PublishDate: "9/25/2015",
		},
	}
}
