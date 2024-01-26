package database

import (
	"fmt"
	"github.com/jns-w/menud/menud-go-server/models"
	"log"
)

const getMenuQuery = `
		SELECT
			m.id,
			m.name,
			m.created_at,
			m.updated_at,
			COALESCE(json_agg(
				json_build_object(
					'id', c.id,
					'name', c.name,
					'description', c.description,
					'created_at', c.created_at,
					'updated_at', c.updated_at,
					'menu_items', (
						SELECT COALESCE(json_agg(
							json_build_object(
								'id', i.id,
								'name', i.name,
								'description', i.description,
								'image_url', i.image_url,
								'price', i.price,
								'price_suffix', i.price_suffix,
								'created_at', i.created_at,
								'updated_at', i.updated_at
							)
							ORDER BY i.created_at
						), '[]'::json)
						FROM menu_items i WHERE i.id = any(c.menu_item_ids)
					)
				) ORDER BY c.created_at
			), '[]'::json) AS categories
		FROM
			menus m
		LEFT JOIN
			menu_categories c ON c.id = any(m.category_ids)
		WHERE
			m.name = $1
		GROUP BY
			m.id;
`

func GetMenu(menuName string) ([]models.Menu, error) {
	var menus []models.Menu
	log.Println("Getting menu")

	rows, err := DB.Queryx(getMenuQuery, menuName)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var menu models.Menu
		err := rows.StructScan(&menu)
		if err != nil {
			return nil, fmt.Errorf("failed to scan menu row: %v", err)
		}
		menus = append(menus, menu)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over rows: %v", err)
	}

	return menus, nil
}
